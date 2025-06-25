const generateRandomKey = () => {
    return Math.random().toString()
}

type budgetsType =  {
    category: string;
    maximum: number;
    theme: string;
}[]

export function getCategoryOptions(budgets: budgetsType) {
  const categoryOptions = [
    'General', 'Dining Out', 'Groceries', 'Entertainment', 'Transportation',
    'Lifestyle', 'Personal Care', 'Education', 'Bills', 'Shopping',
  ]
  const usedCategories = new Set(budgets.map((b) => b.category));

  return categoryOptions
    .filter((label) => usedCategories.has(label))
    .map((label) => ({
      label,
      value: label,
      key: generateRandomKey(),
    }));
}

export function getThemeOptions(budgets: budgetsType) {
  const themes: { label: string; value: string }[] = [
    { label: 'Green', value: '#277C78' }, { label: 'Yellow', value: '#F2CDAC' },
    { label: 'Cyan', value: '#82C9D7' }, { label: 'Navy', value: '#626070' },
    { label: 'Red', value: '#C94736' }, { label: 'Purple', value: '#AF81BA' },
    { label: 'Turqoise', value: '#597C7C' }, { label: 'Brown', value: '#93674F' },
    { label: 'Magenta', value: '#934F6F' }, { label: 'Blue', value: '#3F82B2' },
    { label: 'Navy Grey', value: '#97A0AC' }, { label: 'Army Green', value: '#7F9161' },
    { label: 'Gold', value: '#CAB361' }, { label: 'Orange Grey', value: '#BE6C49' },
  ]

  const usedThemes = new Set(budgets.map((b) => b.theme))

  return themes
    .filter((theme) => !usedThemes.has(theme.value))
    .map((theme) => ({
      ...theme,
      key: generateRandomKey(),
    }))
}
