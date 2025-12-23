const success = '#4CAF50'; // Vert Succès
const serenity = '#2196F3'; // Bleu Sérénité
const background = '#F5F5F5';
const text = '#333333';
const tintColorLight = serenity;
const tintColorDark = '#fff';

export default {
  light: {
    text: text,
    background: background,
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    success: success,
    serenity: serenity,
    cardBackground: '#ffffff',
    borderColor: '#e0e0e0',
  },
  dark: {
    text: '#fff',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    success: '#81C784',
    serenity: '#64B5F6',
    cardBackground: '#1E1E1E',
    borderColor: '#333333',
  },
};
