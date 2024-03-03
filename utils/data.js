  const possibleReactions = [
    'like',
    'love',
    'dislike',

  ];
  
  const users = [];

  // Function to generate random thoughts that we can add to the database. Includes application tags.
  const getRandomThoughts = (int) => {
    let results = [];
    for (let i = 0; i < int; i++) {
      results.push({
        published: Math.random() < 0.5,
        description: getRandomArrItem(appDescriptions),
        buildSuccess: Math.random() < 0.5,
        tags: [...getThoughtReaction(3)],
      });
    }
    return results;
  };
  
  // Create the tags that will be added to each application
  const getThoughtsTags = (int) => {
    if (int === 1) {
      return getRandomArrItem(possibleReactions);
    }
    const results = [];
    for (let i = 0; i < int; i++) {
      results.push({
        tagBody: getRandomArrItem(possibleReactions),
        username: getRandomName(),
      });
    }
    return results;
  };
  
  // Export the functions for use in seed.js
  module.exports = { getRandomThoughts };
  