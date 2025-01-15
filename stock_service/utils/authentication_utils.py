from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from typing import Optional

# These should match the values used in authentication service
SECRET_KEY = "tunahan"  # Should be same as auth service
ALGORITHM = "HS256"
security = HTTPBearer()

async def verify_role(credentials: HTTPAuthorizationCredentials = Security(security)) -> Optional[str]:
    """
    Verify the JWT token and check if user has moderator or admin role.
    
    Args:
        credentials: The HTTP Authorization credentials containing the bearer token
        
    Returns:
        str: The username extracted from the token if valid and has required role
        
    Raises:
        HTTPException: 401 if token is invalid or expired
        HTTPException: 403 if user does not have required role
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if role not in ["moderator", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not have required permissions",
            )
            
        return username
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials", 
            headers={"WWW-Authenticate": "Bearer"},
        )
