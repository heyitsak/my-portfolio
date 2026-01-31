import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface TravelStory {
  slug: string;
  title: string;
  excerpt: string;
  location: string;
  date: string;
  image: string;
  content: string;
}

const storiesDirectory = path.join(process.cwd(), "app/stories/_posts");

export function getAllStories(): TravelStory[] {
  const files = fs.readdirSync(storiesDirectory);
  const mdxFiles = files.filter(
    (file) => file.endsWith(".mdx") && !file.startsWith("_")
  );

  const stories = mdxFiles.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const filePath = path.join(storiesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      location: data.location || "",
      date: data.date || "",
      image: data.image || "/stories/default.jpg",
      content,
    };
  });

  return stories;
}

export function getStoryBySlug(slug: string): TravelStory | undefined {
  return getAllStories().find((story) => story.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllStories().map((story) => story.slug);
}

// Export for components
export const travelStories = getAllStories();
