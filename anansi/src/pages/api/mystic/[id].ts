import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorResponse, Wallet} from "../../../interfaces/index";


const mysticOptions = (query: string) => ({
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  
const mysticFetcher = async (query: string): Promise<Wallet | ErrorResponse> => {
    
    const endpoint = process.env.MYSTIC_GRAPHQL_ENDPOINT || "http://dnaoversight.gg/query/subgraphs/name/mystic-tracker";
    try {
      const response = await fetch(endpoint, mysticOptions(query));
  
      if (!response.ok) {
        // Handle non-200 HTTP status codes (e.g., 404 Not Found)
        throw new Error('Network response was not ok');
      }
  
      const json = await response.json();
  
      if (json.errors) {
        // Handle GraphQL errors
        return { errors: json.errors };
      }
  
      return json.data;
    } catch (error) {
      // Handle any other errors that may occur during the API call
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data from the API');
    }
  };
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse<Wallet | ErrorResponse>) {
    const { query } = req;
    const roninID = query.id as string;
    const QUERYSTRING = `{
      wallet(id: "${roninID}") {
        id
        mysticAxies(orderBy: tokenID orderDirection: asc) {
          id
          tokenID
        }
      }
    }`;
  
    try {
      const response = await mysticFetcher(QUERYSTRING);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json(error as ErrorResponse);
    }
  }