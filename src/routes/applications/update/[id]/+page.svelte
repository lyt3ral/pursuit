<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props();
</script>

<div class="max-w-2xl mx-auto bg-foreground rounded-xl shadow-lg border border-border p-8">
	<h2 class="text-3xl font-bold text-heading mb-6 text-center">Update Application</h2>
	<form method="POST" action="?/updateApplication" class="space-y-6">
		<div>
			<label for="role" class="block text-body text-sm font-medium mb-1">Role:</label>
			<input
				type="text"
				id="role"
				name="role"
				class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
				value={data.application.role}
				required
			/>
		</div>

		<div>
			<label for="company" class="block text-body text-sm font-medium mb-1">Company:</label>
			<input
				type="text"
				id="company"
				name="company"
				class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
				value={data.application.company}
				required
			/>
		</div>

		<div>
			<label for="type" class="block text-body text-sm font-medium mb-1">Type:</label>
			<select
				id="type"
				name="type"
				class="w-full p-3 border border-border rounded-lg bg-background text-body focus:outline-none focus:ring-2 focus:ring-primary"
				value={data.application.type}
				required
			>
				<option value="FULLTIME">Full-Time</option>
				<option value="PARTTIME">Part-Time</option>
				<option value="CONTRACT">Contract</option>
				<option value="INTERNSHIP">Internship</option>
				<option value="FREELANCE">Freelance</option>
			</select>
		</div>

		<div>
			<label for="location" class="block text-body text-sm font-medium mb-1">Location:</label>
			<input
				type="text"
				id="location"
				name="location"
				class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
				value={data.application.location}
				required
			/>
		</div>

		<div>
			<label for="status" class="block text-body text-sm font-medium mb-1">Status:</label>
			<select
				id="status"
				name="status"
				class="w-full p-3 border border-border rounded-lg bg-background text-body focus:outline-none focus:ring-2 focus:ring-primary"
				value={data.application.status}
				required
			>
				<option value="APPLIED">Applied</option>
				<option value="INTERVIEWING">Interviewing</option>
				<option value="OFFER">Offer</option>
				<option value="REJECTED">Rejected</option>
				<option value="GHOSTED">Ghosted</option>
			</select>
		</div>

		<div>
			<label for="model" class="block text-body text-sm font-medium mb-1">Work Model:</label>
			<select
				id="model"
				name="model"
				class="w-full p-3 border border-border rounded-lg bg-background text-body focus:outline-none focus:ring-2 focus:ring-primary"
				value={data.application.model}
				required
			>
				<option value="ONSITE">Onsite</option>
				<option value="REMOTE">Remote</option>
				<option value="HYBRID">Hybrid</option>
			</select>
		</div>

		<div>
			<label for="notes" class="block text-body text-sm font-medium mb-1">Notes:</label>
			<textarea
				id="notes"
				name="notes"
				class="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
				rows="4">{data.application.notes}</textarea
			>
		</div>

		<button
			type="submit"
			class="w-full font-semibold text-heading px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-primary hover:bg-opacity-80"
		>
			Update Application
		</button>
	</form>
</div>
