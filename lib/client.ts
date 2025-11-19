import {z} from "zod";

const listClientsSchema = z.object({
  businessToken: z.string(),
  authToken: z.string(),
});

const ClientSchema = z.object({
  id: z.string(),
  token: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

/**
 * Retrieves a list of clients along with for the current session.
 *
 * @return {Object} An object containing the businessToken, authToken, and an empty data array.
 */
export function listClients() {
  const {businessToken, authToken} = listClientsSchema.parse(process.env);

  return {
    businessToken,
    authToken,
    data: [
      {
        id: "client_001",
        token: "tok_emma_johnson_2024",
        name: "Emma Johnson",
        email: "ltse+emma.johnson@glossgenius.com",
        phone: "+1-415-555-0101",
      },
      {
        id: "client_002",
        token: "tok_marcus_chen_2024",
        name: "Marcus Chen",
        email: "ltse+marcus.chen@glossgenius.com",
        phone: "+1-415-555-0102",
      },
      {
        id: "client_003",
        token: "tok_sofia_rodriguez_2024",
        name: "Sofia Rodriguez",
        email: "ltse+sofia.rodriguez@glossgenius.com",
        phone: "+1-415-555-0103",
      },
      {
        id: "client_004",
        token: "tok_aiden_patel_2024",
        name: "Aiden Patel",
        email: "ltse+aiden.patel@glossgenius.com",
        phone: "+1-415-555-0104",
      },
      {
        id: "client_005",
        token: "tok_olivia_martinez_2024",
        name: "Olivia Martinez",
        email: "ltse+olivia.martinez@glossgenius.com",
        phone: "+1-415-555-0105",
      },
    ],
  };
}
