import { z } from "zod";

const listAppointmentsSchema = z.object({
  authToken: z.string(),
});

const ServiceSchema = z.object({
  id: z.number(),
  token: z.string(),
  name: z.string(),
  price: z.string(),
  image: z.string(),
  description: z.string().nullable(),
  start_time: z.string(),
  end_time: z.string(),
  total_duration: z.number(),
  color: z.string(),
  category_name: z.string().nullable(),
  // Simplified - many other fields exist but not essential for basic queries
});

const ChargeLineItemSchema = z.object({
  descriptor: z.string(),
  item_type: z.string(),
  price: z.string(),
  color: z.string().nullable(),
});

const ChargeSchema = z.object({
  guid: z.string(),
  order_token: z.string(),
  total: z.union([z.string(), z.number()]),
  refunded: z.boolean(),
  card_payment: z.boolean(),
  line_item_count: z.number(),
  line_items: z.array(ChargeLineItemSchema),
});

const AppointmentAddressSchema = z.object({
  address_1: z.string().nullable(),
  address_2: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postal_code: z.string().nullable(),
});

const AppointmentSchema = z.object({
  guid: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  total_duration: z.number(),
  total_price: z.string(),
  status: z.string(),
  decorated_status: z.string(),
  cancellation_fee: z.string(),
  cancelled_by_client: z.boolean().nullable(),
  checked_out: z.boolean(),
  self_scheduled: z.boolean(),
  confirmed: z.boolean(),
  no_show: z.boolean().nullable(),
  editable: z.boolean(),
  cancellable: z.boolean(),
  refundable: z.boolean(),
  card_payment: z.boolean(),
  appointment_token: z.string(),
  provider_guid: z.string(),
  provider_full_name: z.string(),
  provider_business_member_token: z.string(),
  client_id: z.number(),
  client_token: z.string(),
  client_name: z.string(),
  client_email: z.string().nullable(),
  client_phone: z.string().nullable(),
  client_initials: z.string(),
  client_pronouns: z.string().nullable(),
  client_profile_image: z.string().nullable(),
  has_notes: z.boolean(),
  address_information: z.string(),
  appointment_address: AppointmentAddressSchema,
  services: z.array(ServiceSchema),
  charge: ChargeSchema.optional(),
  charge_guid: z.string().nullable(),
});

const ApiResponseSchema = z.object({
  data: z.array(AppointmentSchema),
});

const DateRangeApiResponseSchema = z.object({
  data: z.array(AppointmentSchema),
  meta: z.object({
    from: z.string(),
    to: z.string(),
  }),
});

/**
 * Retrieves past appointments for a specific client from the GlossGenius staging API.
 * The appointments are sorted by reverse chronological order.
 *
 * @param clientId - The client ID to fetch appointments for
 * @return {Object} The API response with past appointments data
 */
export async function listPastClientAppointments(clientId: number) {
  const { authToken } = listAppointmentsSchema.parse(process.env);

  const response = await fetch(
    `https://api.glossgenius-staging.com/v3/clients/${clientId}/appointments?appointment_type=past`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch appointments: ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();
  const { data } = ApiResponseSchema.parse(json);

  return {
    data,
  };
}

/**
 * Retrieves appointments within a date range for specific providers from the GlossGenius staging API.
 *
 * @param options - Query options
 * @param options.from - Start date/time in ISO format (e.g., "2025-11-02T00:00:00.000-07:00")
 * @param options.to - End date/time in ISO format (e.g., "2025-11-08T23:59:59.000-08:00")
 * @param options.providerGuids - Array of provider GUIDs to filter by
 * @return {Object} The API response with appointments data and date range metadata
 */
export async function listAppointmentsByDateRange(options: {
  from: string;
  to: string;
  providerGuids: string[];
}) {
  const { authToken } = listAppointmentsSchema.parse(process.env);
  const { from, to, providerGuids } = options;

  // Build query parameters
  const params = new URLSearchParams();
  params.append("from", from);
  params.append("to", to);
  providerGuids.forEach((guid) => {
    params.append("providers_guids[]", guid);
  });

  const response = await fetch(
    `https://api.glossgenius-staging.com/v3/appointments?${params.toString()}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch appointments: ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();
  const { data, meta } = DateRangeApiResponseSchema.parse(json);

  return {
    data,
    meta,
  };
}
