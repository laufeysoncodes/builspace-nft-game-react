const CONTRACT_ADDRESS = "0x7e24be2697305D92758D95FF6f7430EF48d9D489";

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp,
    maxHp: characterData.maxHp,
    attackDamage: characterData.attackDamage,
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
