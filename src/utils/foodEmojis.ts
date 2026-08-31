export function getFoodEmoji(foodName: string): string {
  const name = foodName.toLowerCase();
  
  if (name.includes('chicken') || name.includes('turkey')) return '🍗';
  if (name.includes('beef') || name.includes('steak') || name.includes('meat')) return '🥩';
  if (name.includes('pork') || name.includes('bacon') || name.includes('sausage')) return '🥓';
  if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) return '🐟';
  if (name.includes('egg') || name.includes('omelet')) return '🍳';
  if (name.includes('milk') || name.includes('cheese') || name.includes('paneer')) return '🧀';
  if (name.includes('yogurt') || name.includes('curd')) return '🥣';
  
  if (name.includes('rice') || name.includes('pulao') || name.includes('biryani')) return '🍚';
  if (name.includes('bread') || name.includes('naan') || name.includes('roti') || name.includes('chapati')) return '🍞';
  if (name.includes('noodle') || name.includes('pasta') || name.includes('spaghetti') || name.includes('maggi')) return '🍝';
  if (name.includes('potato') || name.includes('aloo') || name.includes('fries')) return '🍟';
  if (name.includes('pizza')) return '🍕';
  if (name.includes('burger') || name.includes('sandwich')) return '🍔';
  
  if (name.includes('apple')) return '🍎';
  if (name.includes('banana')) return '🍌';
  if (name.includes('orange')) return '🍊';
  if (name.includes('grape')) return '🍇';
  if (name.includes('watermelon')) return '🍉';
  if (name.includes('fruit')) return '🍓';
  
  if (name.includes('salad') || name.includes('lettuce') || name.includes('spinach')) return '🥗';
  if (name.includes('carrot')) return '🥕';
  if (name.includes('broccoli')) return '🥦';
  if (name.includes('tomato')) return '🍅';
  if (name.includes('onion')) return '🧅';
  if (name.includes('mushroom')) return '🍄';
  if (name.includes('veg')) return '🥬';
  if (name.includes('cucumber')) return '🥒';
  
  if (name.includes('cake') || name.includes('pastry')) return '🍰';
  if (name.includes('cookie') || name.includes('biscuit')) return '🍪';
  if (name.includes('chocolate')) return '🍫';
  if (name.includes('ice cream')) return '🍦';
  if (name.includes('sweet') || name.includes('mithai') || name.includes('dessert') || name.includes('gulab')) return '🍮';
  
  if (name.includes('coffee')) return '☕';
  if (name.includes('tea') || name.includes('chai')) return '🍵';
  if (name.includes('juice')) return '🥤';
  if (name.includes('water')) return '💧';
  if (name.includes('beer') || name.includes('wine')) return '🍷';
  
  if (name.includes('dal') || name.includes('lentil') || name.includes('chana') || name.includes('rajma') || name.includes('bean') || name.includes('soup')) return '🍲';
  if (name.includes('curry') || name.includes('masala')) return '🍛';
  if (name.includes('dosa') || name.includes('idli') || name.includes('crepe')) return '🥞'; 

  return '🍽️';
}
