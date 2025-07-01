// // lib/apiClient.ts
// import axios from "axios";

// export type ApiData = {
//   message: string;
//   timestamp: string;
// };

// export async function fetchApiData(): Promise<ApiData> {
//   try {
//     const response = await axios.get<ApiData>("http://localhost:3001/data");
//     return response.data;
//   } catch (error: any) {
//     throw new Error(`Failed to fetch API data: ${error.message}`);
//   }
// }
