import { manageFriends } from './src/presentation/friend-manager.js';

const run = async () => {
  console.log("Starting app...");   
  await manageFriends();
};

run();