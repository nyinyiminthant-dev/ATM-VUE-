import { cva, type VariantProps } from 'class-variance-authority'

export { default as Card } from './Card.vue'
export { default as CardAction } from './CardAction.vue'
export { default as CardContent } from './CardContent.vue'
export { default as CardDescription } from './CardDescription.vue'
export { default as CardFooter } from './CardFooter.vue'
export { default as CardHeader } from './CardHeader.vue'
export { default as CardTitle } from './CardTitle.vue'

export const cardVariants = cva(
  'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        elevated: 'shadow-lg',
        outlined: 'shadow-none border-border',
        gradient: 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-md',
        glass: 'bg-white/10 backdrop-blur-lg border-white/20 shadow-lg',
        dark: 'bg-card/50 backdrop-blur-sm border-border/50 shadow-lg',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
    compoundVariants: [
      {
        variant: 'outlined',
        padding: 'none',
        class: 'p-6',
      },
    ],
  },
)

export type CardVariants = VariantProps<typeof cardVariants>