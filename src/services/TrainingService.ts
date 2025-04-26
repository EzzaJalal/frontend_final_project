import { Training, Customer } from "../types";

export const getTrainingsData = async (): Promise<Training[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/gettrainings`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform raw data to conform to our Training type.
    const trainings: Training[] = data.map((tr: { id?: number; date: string; duration: number; activity: string; customer: Customer | string; _links?: { training?: { href: string }; customer?: { href: string } } }) => {
      // Extract training id: either use existing id or parse from _links.training.href.
      const id =
        tr.id ||
        (tr._links?.training?.href
          ? parseInt((tr._links.training.href ?? "").split("/").pop() ?? "0", 10)
          : 0);

      // Convert customer field: if it is an object, assume it conforms to Customer; if it is a string,
      // keep it as a string (URL).
      let customer: Customer | string;
      if (typeof tr.customer === "object") {
        customer = tr.customer;
      } else if (typeof tr.customer === "string") {
        customer = tr.customer;
      } else {
        // Fallback in case customer data is missing.
        customer = {
          id: 0,
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          streetaddress: "",
          postcode: "",
          city: "",
        };
      }

      // Validate customer link
      const customerLink = tr._links?.customer?.href && tr._links.customer.href.startsWith("https://")
        ? { href: tr._links.customer.href }
        : undefined;

      return {
        id,
        date: tr.date,
        duration: tr.duration,
        activity: tr.activity,
        customer,
        _links: {
          customer: customerLink,
          training: tr._links?.training,
        },
      };
    });

    return trainings;
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return [];
  }
};