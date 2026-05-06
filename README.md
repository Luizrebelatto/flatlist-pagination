# FlatList Pagination

Compare three different pagination

- Page-based
- Offset-based
- cursor-based

## How to run

##### Api

```bash
cd api-page-based
npm install
node server.js
```

##### App

```bash
cd ..
npm install
npx expo start
```

### 1. Page-based

Here we have two types:

- infinite scroll
- number page

###### Infinite scroll `app/(tabs)/infinite-scroll.tsx`

- It loads as the user scrolls
- even though it's infinite, the request isn't made all at once
- use this when user are exploring

request: `GET /items?page=N&limit=10`
response: `{ data, page, limit, totalItems, totalPages }`

page = next page
limit = quantity per page

- function called when the end of the list is reached

```javascript
onEndReached = { handleLoadMore };
```

- determines when it reaches the bottom of the screen; range from 0 to 1

```javascript
onEndReachedThreshold={0.3}
```

###### Pagination by number `app/(tabs)/pagination.tsx`

- does not accumulate the data; it overwrites it
- Use this when the user is searching for something specific

request: `GET /items?page=N&limit=10`
response: `{ data, page, limit, totalItems, totalPages }`

- function called when the end of the list is reached

### 2. Off-Set

- don't specify the number of pages
- you specify how many items you want and define a starting item
- navigation buttons
- next / prev or select a specific page
- replace all

```bash
/items-offset?offset=20&limit=10
```
