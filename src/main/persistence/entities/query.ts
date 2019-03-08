const QueryTableName = 'Query';
const QuerySchema = {
  name: QueryTableName,
  properties: {
    uuid:  'string',
    searchString: 'string',
    createdAt: 'date',
    completedAt: 'date?',
    filename: 'string'
  }
}

class Query {
  schema = QuerySchema
}


