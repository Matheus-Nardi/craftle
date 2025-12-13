/**
 * Utilitário para feedback tátil em dispositivos móveis
 */

/**
 * Vibra o dispositivo (se suportado)
 * @param pattern Padrão de vibração em ms (ex: [100, 50, 100])
 */
export const vibrate = (pattern: number | number[] = 50): void => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignora erros de vibração
    }
  }
};

/**
 * Feedback tátil para ações de sucesso
 */
export const successFeedback = (): void => {
  vibrate([50, 30, 50]);
};

/**
 * Feedback tátil para ações de erro
 */
export const errorFeedback = (): void => {
  vibrate([100, 50, 100]);
};

/**
 * Feedback tátil para ações de clique/toque
 */
export const tapFeedback = (): void => {
  vibrate(30);
};

