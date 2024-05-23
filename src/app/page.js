import Header from "./ui/header";
import "./globals.css";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/graph");
}
