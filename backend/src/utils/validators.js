const { z } = require('zod');

const nonEmptyString = z.string().trim().min(1);

const portfolioInputSchema = z.object({
  name: nonEmptyString,
  title: nonEmptyString,
  bio: nonEmptyString,
  skills: z.array(nonEmptyString).min(1),
  projects: z
    .array(
      z.object({
        name: nonEmptyString,
        description: nonEmptyString,
        techStack: z.array(nonEmptyString).default([]),
        link: z.string().trim().url().optional().or(z.literal('')),
        repo: z.string().trim().url().optional().or(z.literal(''))
      })
    )
    .min(1),
  experience: z
    .array(
      z.object({
        role: nonEmptyString,
        company: nonEmptyString,
        duration: nonEmptyString,
        details: nonEmptyString
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: nonEmptyString,
        degree: nonEmptyString,
        year: nonEmptyString
      })
    )
    .default([]),
  contact: z.object({
    email: z.string().trim().email(),
    phone: z.string().trim().optional().default(''),
    location: z.string().trim().optional().default(''),
    linkedin: z.string().trim().url().optional().or(z.literal('')),
    github: z.string().trim().url().optional().or(z.literal(''))
  }),
  designStyle: z.enum(['minimal', 'modern', 'dark']).default('modern'),
  framework: z.enum(['html', 'react']).default('html')
});

function parsePortfolioInput(payload) {
  return portfolioInputSchema.parse(payload);
}

module.exports = {
  parsePortfolioInput
};
