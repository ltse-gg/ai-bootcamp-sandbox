import { z } from "zod";

const listClientsSchema = z.object({
  businessToken: z.string(),
  authToken: z.string(),
});

const ClientSchema = z.object({
  id: z.number(),
  token: z.string(),
  name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  initials: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  date_of_birth: z.string().nullable(),
});

const ApiResponseSchema = z.object({
  data: z.array(ClientSchema),
  meta: z.object({
    total_clients: z.number(),
  }),
});

/**
 * Retrieves a list of clients from the GlossGenius staging API.
 *
 * @return {Object} An object containing the businessToken, authToken, client data array, and metadata.
 */
export async function listClients() {
  const { authToken } = listClientsSchema.parse(process.env);

  const response = await fetch(
    "https://api.glossgenius-staging.com/v3/clients?limit=99999",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch clients: ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();
  const { data, meta } = ApiResponseSchema.parse(json);

  return {
    data,
    meta,
  };
}
