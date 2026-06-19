export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export const getPositionColor = (position: string): string => {
  switch (position) {
    case 'GK': return '#FF9800';
    case 'DEF': return '#2196F3';
    case 'FWD': return '#F44336';
    default: return '#888';
  }
};

export const getLastName = (fullName: string): string => {
  const parts = fullName.split(' ');
  return parts[parts.length - 1];
};

export const formatPrice = (price: number): string => `${price.toFixed(1)}M`;
