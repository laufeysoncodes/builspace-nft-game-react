const CONTRACT_ADDRESS = "0x09B0cF9EC9b0937Fe026265A2848d969883477c6";

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
