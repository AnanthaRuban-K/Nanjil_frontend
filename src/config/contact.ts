// config/contact.ts

export const CONTACT_CONFIG = {
  phone: "+918428489046",
  phoneDisplay: "+91 84284 89046",
  whatsappNumber: "918428489046",
  whatsappUrl:
    "https://wa.me/918428489046?text=Hi%2C%20I%20need%20a%20service%20booking%20from%20Nanjil%20MEP%20Service.",
  callUrl: "tel:+918428489046",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "/bookings/new",
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "nanjilmep@upi",
  upiName: process.env.NEXT_PUBLIC_UPI_NAME || "Nanjil MEP Service",
  companyName: "Nanjil MEP Service",
  serviceArea: "Nagercoil",
};
