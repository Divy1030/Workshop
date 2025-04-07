import { FormData } from "@/context/FormContext";
import { RegistrationData } from "@/lib/api";

export function mapFormToRegistrationData(formData: FormData): RegistrationData {
  // Map year value: In frontend it's "1", "2", etc., but in backend it's "1st", "2nd", etc.
  let year = formData.year;
  switch (formData.year) {
    case "1": year = "1st"; break;
    case "2": year = "2nd"; break;
    case "3": year = "3rd"; break;
    case "4": year = "4th"; break;
  }
  
  return {
    full_name: formData.name,
    student_number: formData.rollNo,
    branch: formData.branch,
    year: year,
    gender: formData.gender.toLowerCase(),
    phone: formData.contactNumber,
    email: formData.email,
    living_type: formData.hostlerOrDayScholar === "Hostler" ? "hosteller" : "day scholar"
  };
}