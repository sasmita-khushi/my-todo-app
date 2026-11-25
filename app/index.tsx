import { Link } from "expo-router";

export default function Index() {
  return (
    <div>
      <h1>Welcome to the Index Page</h1>
      <p>This is the main entry point of the application.</p>
      <Link href="/calender">Go to calender</Link>
    </div>
  );
}
