import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    """Smoke test: health endpoint"""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True

@pytest.mark.asyncio
async def test_list_products(client: AsyncClient):
    """Smoke test: list products endpoint"""
    response = await client.get("/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "page" in data
    assert "totalPages" in data

