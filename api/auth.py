"""
JWT authentication & authorization helpers.

Expected token payload:
    {
        "sub": "<user_id>",
        "role": "vendor" | "admin",
        "exp": <unix_timestamp>
    }

Set JWT_SECRET in .env to sign/verify tokens.
"""

import os
from typing import List

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM: str = "HS256"

_bearer_scheme = HTTPBearer()


def decode_token(token: str) -> dict:
    """Decode and validate a JWT; raises HTTPException on failure."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(_bearer_scheme),
) -> dict:
    """FastAPI dependency — validates Bearer JWT and returns the payload."""
    return decode_token(credentials.credentials)


def require_roles(allowed_roles: List[str]):
    """
    Factory that returns a FastAPI dependency enforcing role membership.

    Usage:
        @router.get("/secret", dependencies=[Depends(require_roles(["admin"]))])
    """

    def _check_role(user: dict = Depends(get_current_user)) -> dict:
        role = user.get("role", "")
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{role}' is not authorized for this resource.",
            )
        return user

    return _check_role
