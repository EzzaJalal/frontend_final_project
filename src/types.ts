export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetaddress: string;
  postcode: string;
  city: string;
  _links?: {
    self: { href: string };
    trainings: { href: string };
    customer?: { href: string };
  };
}

export interface Training {
  id: number;
  date: string;
  duration: number;
  activity: string;
  customer: Customer | string; // Can be a Customer object or a URL string
  _links?: {
    customer?: { href: string };
    training?: { href: string };
  };
}