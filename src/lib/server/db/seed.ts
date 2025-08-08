import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { faker } from '@faker-js/faker';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

const companies = [
	{ name: 'Tata Consultancy Services', website: 'tcs.com' },
	{ name: 'Infosys', website: 'infosys.com' },
	{ name: 'Wipro', website: 'wipro.com' },
	{ name: 'HCL Technologies', website: 'hcltech.com' },
	{ name: 'Tech Mahindra', website: 'techmahindra.com' },
	{ name: 'Larsen & Toubro Infotech', website: 'lntinfotech.com' },
	{ name: 'Mindtree', website: 'mindtree.com' },
	{ name: 'Mphasis', website: 'mphasis.com' },
	{ name: 'Hexaware Technologies', website: 'hexaware.com' },
	{ name: 'Coforge', website: 'coforge.com' }
];

const seed = async () => {
	console.log('Seeding database...');

	await db.delete(schema.job);
	await db.delete(schema.company);

	const insertedCompanies = await db.insert(schema.company).values(companies).returning();

	const jobs = [];
	for (let i = 0; i < 30; i++) {
		const company = faker.helpers.arrayElement(insertedCompanies);
		jobs.push({
			role: faker.helpers.arrayElement([
				'Software Engineer',
				'Frontend Developer',
				'Backend Developer',
				'Full Stack Developer',
				'DevOps Engineer',
				'Data Scientist',
				'Machine Learning Engineer'
			]),
			companyId: company.id,
			url: faker.internet.url(),
			model: faker.helpers.arrayElement(['REMOTE', 'ONSITE', 'HYBRID'] as const),
			type: faker.helpers.arrayElement([
				'FULLTIME',
				'INTERNSHIP',
				'CONTRACT'
			] as const),
			location: faker.location.city() + ', India',
			description: faker.lorem.paragraphs(3),
			skills: faker.helpers
				.arrayElements([
					'JavaScript',
					'TypeScript',
					'React',
					'Node.js',
					'Python',
					'Django',
					'Flask',
					'Java',
					'Spring Boot',
					'SQL',
					'NoSQL',
					'AWS',
					'Azure',
					'GCP'
				])
				.join(', '),
			postedOn: faker.date.past(),
			validUntil: faker.date.future()
		});
	}

	await db.insert(schema.job).values(jobs);

	console.log('Database seeded successfully!');
	process.exit(0);
};

seed().catch((err) => {
	console.error('Failed to seed database:', err);
	process.exit(1);
});
