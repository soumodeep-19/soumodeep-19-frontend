import React from 'react';
import {
  Utensils,
  Bus,
  Gamepad2,
  ShoppingBag,
  BookOpen,
  Tv,
  Film,
  User,
  Tag
} from 'lucide-react';

const categoryIcons = {
  Food: Utensils,
  Transportation: Bus,
  Gaming: Gamepad2,
  Shopping: ShoppingBag,
  Education: BookOpen,
  Subscriptions: Tv,
  Entertainment: Film,
  Personal: User,
  Other: Tag
};

const CategoryBadge = ({ category }) => {
  const Icon = categoryIcons[category] || Tag;
  const badgeClass = `category-badge category-${category || 'Other'}`;

  return (
    <span className={badgeClass}>
      <Icon size={13} />
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
