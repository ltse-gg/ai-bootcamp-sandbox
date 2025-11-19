import { z } from "zod";

const listClientsSchema = z.object({
  businessToken: z.string(),
  authToken: z.string(),
});

const clientSchema = z.object({
  id: z.string(),
  token: z.string(),
  name: z.string(),
  email: z.string(),
});

/**
 * Retrieves a list of clients along with for the current session.
 *
 * @return {Object} An object containing the businessToken, authToken, and an empty data array.
 */
export function listClients() {
  const { businessToken, authToken } = listClientsSchema.parse(process.env);

  return {
    businessToken,
    authToken,
    data: [

    ],
  };
}
