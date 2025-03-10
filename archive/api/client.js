import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
    }
  }
});

const client = new ApolloClient({
  link: from([authLink, httpLink]), 
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;