import HomeClient from './HomeClient';
import { getAllPosts } from '../lib/posts';

export default function Home() {
  return <HomeClient posts={getAllPosts()} />;
}
