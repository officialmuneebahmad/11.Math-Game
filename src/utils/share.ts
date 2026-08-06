import html2canvas from 'html2canvas';

export const generateShareImage = async (element: HTMLElement): Promise<string | null> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to generate image', error);
    return null;
  }
};

export const shareResult = async (dataUrl: string, text: string) => {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'mathstreak-score.png', { type: blob.type });

    if (navigator.share) {
      await navigator.share({
        title: 'My MathStreak Score',
        text: text,
        files: [file],
      });
    } else {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert('Image copied to clipboard!');
      } catch (err) {
        console.error('Clipboard write failed:', err);
        await navigator.clipboard.writeText(text);
        alert('Score text copied to clipboard!');
      }
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};