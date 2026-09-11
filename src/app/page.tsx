import HomeClient from './HomeClient';
import { getArchive, getAllCategories, getAllPosts, getAllTags } from '../lib/posts';

export default function Home() {
  return (
    <HomeClient
      posts={getAllPosts()}
      tags={getAllTags()}
      categories={getAllCategories()}
      archive={getArchive()}
    />
  );
}
