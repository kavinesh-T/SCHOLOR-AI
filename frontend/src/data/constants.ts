import { StudentProfile } from '../types';

export const INDIAN_STATES = [
  "All India", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal",
  "Gujarat", "Rajasthan", "Madhya Pradesh", "Kerala", "Andhra Pradesh", "Telangana",
  "Bihar", "Odisha", "Punjab", "Haryana", "Assam", "Jharkhand", "Chhattisgarh",
  "Delhi", "Himachal Pradesh", "Uttarakhand", "Jammu and Kashmir", "Goa", "Tripura",
  "Meghalaya", "Manipur", "Nagaland", "Arunachal Pradesh", "Sikkim", "Mizoram"
];

export const EDUCATION_LEVELS = [
  "High School (Class 9-10)",
  "Higher Secondary (Class 11-12)",
  "Diploma",
  "Undergraduate (UG)",
  "Postgraduate (PG)",
  "PhD / Doctoral"
];

export const COURSES = [
  "B.Tech / B.E.",
  "MBBS / BDS / Medical",
  "B.Sc",
  "B.Com",
  "B.A.",
  "BBA / BMS",
  "B.Pharm",
  "Law / LLB",
  "M.Tech / M.E.",
  "MBA",
  "M.Sc",
  "M.Com",
  "M.A.",
  "Polytechnic / Diploma",
  "General Schooling",
  "Other"
];

export const CATEGORIES = [
  "General",
  "OBC",
  "SC",
  "ST",
  "EWS",
  "Minority"
];

export const INSTITUTION_TYPES = [
  "Government / Central",
  "Government / State",
  "Private / Autonomous",
  "Deemed University",
  "Other"
];

export const PARENT_EMPLOYMENTS = [
  "Agriculture / Farming",
  "Daily Wage / Informal Worker",
  "Salaried (Private)",
  "Government Service",
  "Self-Employed / Small Business",
  "Retired / Unemployed",
  "Other"
];

export const SAMPLE_PROFILES: { label: string; description: string; profile: StudentProfile }[] = [
  {
    label: "Priya Sharma (B.Tech, Maharashtra, OBC)",
    description: "2nd Year Engineering girl, OBC category, ₹2.2L family income, rural background.",
    profile: {
      name: "Priya Sharma",
      age: 19,
      gender: "Female",
      state: "Maharashtra",
      district: "Pune",
      category: "OBC",
      education_level: "Undergraduate (UG)",
      course: "B.Tech / B.E.",
      specialization: "Computer Science & Engineering",
      institution_type: "Government / State",
      current_year: "2nd Year",
      percentage_cgpa: 86.5,
      previous_marks: 88.0,
      annual_family_income: 220000,
      income_certificate: "Available",
      parent_employment: "Agriculture / Farming",
      disability_status: "No",
      first_generation: "Yes",
      scholarship_already_received: "No",
      residence_type: "Hosteler",
      single_girl_child: "No",
      rural_area: "Yes"
    }
  },
  {
    label: "Aarav Patel (Medical, Gujarat, General)",
    description: "1st Year MBBS student, Gujarat domicile, ₹3.5L family income, high merit.",
    profile: {
      name: "Aarav Patel",
      age: 19,
      gender: "Male",
      state: "Gujarat",
      district: "Ahmedabad",
      category: "General",
      education_level: "Undergraduate (UG)",
      course: "MBBS / BDS / Medical",
      specialization: "Medicine & Surgery",
      institution_type: "Government / State",
      current_year: "1st Year",
      percentage_cgpa: 91.2,
      previous_marks: 92.5,
      annual_family_income: 350000,
      income_certificate: "Available",
      parent_employment: "Self-Employed / Small Business",
      disability_status: "No",
      first_generation: "No",
      scholarship_already_received: "No",
      residence_type: "Hosteler",
      single_girl_child: "No",
      rural_area: "No"
    }
  },
  {
    label: "Kavita Meena (Class 12, Rajasthan, ST)",
    description: "Higher Secondary girl, ST category, ₹1.5L income, first-gen student.",
    profile: {
      name: "Kavita Meena",
      age: 17,
      gender: "Female",
      state: "Rajasthan",
      district: "Jaipur",
      category: "ST",
      education_level: "Higher Secondary (Class 11-12)",
      course: "Higher Secondary (Class 11-12)",
      specialization: "Science (PCB)",
      institution_type: "Government / State",
      current_year: "Class 12",
      percentage_cgpa: 82.0,
      previous_marks: 84.5,
      annual_family_income: 150000,
      income_certificate: "Available",
      parent_employment: "Agriculture / Farming",
      disability_status: "No",
      first_generation: "Yes",
      scholarship_already_received: "No",
      residence_type: "Day Scholar",
      single_girl_child: "Yes",
      rural_area: "Yes"
    }
  },
  {
    label: "Rahul Kumar (Diploma, Karnataka, SC)",
    description: "Polytechnic Mechanical student, SC category, ₹1.2L income, first-gen.",
    profile: {
      name: "Rahul Kumar",
      age: 18,
      gender: "Male",
      state: "Karnataka",
      district: "Bengaluru Rural",
      category: "SC",
      education_level: "Diploma",
      course: "Polytechnic / Diploma",
      specialization: "Mechanical Engineering",
      institution_type: "Government / State",
      current_year: "2nd Year",
      percentage_cgpa: 74.5,
      previous_marks: 78.0,
      annual_family_income: 120000,
      income_certificate: "Available",
      parent_employment: "Daily Wage / Informal Worker",
      disability_status: "No",
      first_generation: "Yes",
      scholarship_already_received: "No",
      residence_type: "Hosteler",
      single_girl_child: "No",
      rural_area: "Yes"
    }
  }
];

export const COMMON_DOCUMENTS = [
  {
    id: "aadhaar",
    name: "Aadhaar Card / Government Photo ID",
    description: "Must be seeded with an active bank account for DBT payment disbursement.",
    issuingAuthority: "UIDAI",
    requiredFor: "Mandatory for 98% of Indian scholarships"
  },
  {
    id: "income_cert",
    name: "Income Certificate (Valid for Current Financial Year)",
    description: "Official income certificate issued by Tehsildar, Revenue Officer, or SDO.",
    issuingAuthority: "Revenue Dept / Tehsildar Office",
    requiredFor: "Means-based & EBC/EWS scholarships"
  },
  {
    id: "caste_cert",
    name: "Community / Caste / Category Certificate",
    description: "Certificate validating SC, ST, OBC (Non-Creamy Layer), or EWS status.",
    issuingAuthority: "Sub-Divisional Magistrate / Tehsildar",
    requiredFor: "Reserved category scholarships"
  },
  {
    id: "bonafide_cert",
    name: "Bonafide Student Certificate / College ID",
    description: "Proof of enrollment signed by the Head of Institution or Principal.",
    issuingAuthority: "Your School / College / University",
    requiredFor: "All higher education applications"
  },
  {
    id: "marksheets",
    name: "Previous Examination Mark Sheets (10th/12th/Semesters)",
    description: "Attested copies of recent academic results verifying percentage/CGPA.",
    issuingAuthority: "State Board / CBSE / University Registrar",
    requiredFor: "Merit verification"
  },
  {
    id: "bank_passbook",
    name: "Student Bank Account Passbook / Cancelled Cheque",
    description: "Bank account in applicant's own name showing Account No, IFSC, and Bank Seal.",
    issuingAuthority: "Nationalized or Scheduled Commercial Bank",
    requiredFor: "Direct Benefit Transfer (DBT)"
  },
  {
    id: "photo",
    name: "Recent Passport Size Photographs",
    description: "Recent color photograph with light background in JPEG/PNG format.",
    issuingAuthority: "Self / Photo Studio",
    requiredFor: "Identity verification"
  },
  {
    id: "domicile",
    name: "State Domicile / Residence Certificate",
    description: "Proof of permanent residence within the issuing Indian State.",
    issuingAuthority: "District Magistrate / Tehsildar",
    requiredFor: "State-specific government schemes"
  },
  {
    id: "pwd_cert",
    name: "Disability Certificate / UDID Card (If applicable)",
    description: "Valid certificate indicating permanent disability of 40% or more.",
    issuingAuthority: "District Medical Board / Civil Surgeon",
    requiredFor: "AICTE Saksham & PwD schemes"
  }
];
