# Page-Based Pagination API

A simple Express.js API that provides paginated access to 100 items sorted by creation date.

## Installation & Setup

```bash
npm install
node server.js
```

Server runs on `http://localhost:3000`

## API Endpoint

### GET /items

Returns paginated items.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page

**Examples:**
```bash
curl http://localhost:3000/items
curl http://localhost:3000/items?page=2&limit=20
```

**Response:**
```json
{
  "data": [
    { "id": 1, "name": "Item 1", "createdAt": 1682534400000 },
    { "id": 2, "name": "Item 2", "createdAt": 1682534399000 }
  ],
  "page": 1,
  "limit": 10,
  "totalItems": 100,
  "totalPages": 10
}
```

**Response Fields:**
- `data` - Array of items for current page
- `page` - Current page number
- `limit` - Items per page
- `totalItems` - Total count of all items
- `totalPages` - Total number of pages

## Features

- Page-based pagination with configurable page size
- Items sorted by creation date (newest first)
- CORS enabled for cross-origin requests
- In-memory storage (resets on server restart)
- Lightweight with minimal dependencies

## Notes

- 100 items available by default
- No authentication required
- API is read-only
- Modify port in `server.js` if 3000 is in use

## Tech Stack

- Node.js
- Express 5.2.1
- CORS 2.8.6
