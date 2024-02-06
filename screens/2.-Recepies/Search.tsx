// Functions that assist the search of recepies

export function getLastWord(inputString: string): string | null {
  // Remove leading and trailing whitespaces
  const trimmedString = inputString.trim();

  // Split the string into an array of words
  const words = trimmedString.split(' ');

  // Check if there are any words in the array
  if (words.length === 0) {
    return null;
  }

  // Return the last word
  return words[words.length - 1];
}

export function quitarTildesYMayusculas(inputString: string): string {
  // Utiliza normalize para descomponer las letras con tilde y luego quitar las tildes
  const stringSinTildes = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Convierte a mayúsculas
  const stringEnMayusculas = stringSinTildes.toUpperCase();

  return stringEnMayusculas;
}

export function deleteLastWord(inputString: string): string {
  // Split the string into an array of words
  const words = inputString.split(' ');

  // Remove the last word from the array
  words.pop();

  // Join the remaining words back into a string
  const resultString = words.join(' ');

  return resultString;
}