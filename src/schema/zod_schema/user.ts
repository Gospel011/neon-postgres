import * as z from "zod";

export const userSchema = z.object({
  name: z.string("Please provide your name"),
  email: z.string("Please provide your email"),
  age: z.coerce.number("Please provide your age"),
  lat: z.coerce
    .number("Coordinates required")
    .min(-90, { abort: true, error: "Invalid latitude bounds" })
    .max(90, "Invalid latitude bounds"),
  lng: z.coerce
    .number("Coordinates required")
    .min(-180, "Invalid longitude bounds")
    .max(180, "Invalid longitude bounds"),
});

export type CreateUserData = z.infer<typeof userSchema>;
