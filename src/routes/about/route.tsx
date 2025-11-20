import { GridCol } from "@/components/grid/grid";

export default async function About() {
  return (
    <GridCol>
      <article className="prose max-w-none p-8 md:p-12">
        <h1>About Page</h1>
        <p>This is the about page of our application.</p>
      </article>
    </GridCol>
  );
}
