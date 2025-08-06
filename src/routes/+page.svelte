<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-8 bg-red-300 h-full min-h-screen">
	<div class="flex justify-between items-center">
		<div class="flex gap-4 items-center">
			<h1 class="text-3xl font-semibold font-serif mr-6">pursuit</h1>
			<a href="/applications" class="hover:underline">applications</a>
			<a href="/jobs" class="hover:underline">jobs</a>
		</div>
		<div class="flex gap-4 items-center">
			<p>
				{data.user.username}
			</p>
			<form method="POST" action="?/logout" use:enhance class="w-full md:w-auto">
				<button
					class="font-medium bg-yellow-200 px-4 py-2 border rounded transition hover:bg-yellow-300 cursor-pointer"
				>
					Logout
				</button>
			</form>
		</div>
	</div>

	<p class="text-lg mt-12 font-serif">new job listings</p>
	<!-- placeholder div for new job listings -->
	<div class="min-w-full h-48 mt-2 flex flex-row space-x-4">
		<div class="border bg-white w-64">
			<div
				class="h-12 border-b
			 bg-blue-200"
			></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
		</div>
		<div class="border bg-white w-64">
			<div
				class="h-12 border-b
			 bg-blue-200"
			></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
		</div>
		<div class="border bg-white w-64">
			<div
				class="h-12 border-b
			 bg-blue-200"
			></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
		</div>
		<div class="border bg-white w-64">
			<div
				class="h-12 border-b
			 bg-blue-200"
			></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
			<div class="rounded h-2 animate-pulse bg-blue-200 mt-4 mx-2"></div>
		</div>
	</div>

	<div class="flex justify-between items-center mt-12">
		<p class="text-lg font-serif">your recent applications</p>
		<a
			href="/applications/new"
			class="bg-blue-200 border px-4 py-2 rounded hover:bg-blue-300 transition">Add New</a
		>
	</div>

	<div class="overflow-y-auto max-h-64 mt-2 border">
		<table class="min-w-full bg-white">
			<thead>
				<tr>
					<th
						class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
						>COMPANY</th
					>
					<th
						class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
						>ROLE</th
					>
					<th
						class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
						>STATUS</th
					>
					<th
						class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
						>TYPE</th
					>
					<th
						class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
						>MODEL</th
					>
					<th
						class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
						>LOCATION</th
					>
					<th
						class="sticky top-0 bg-blue-200 py-3 px-6 text-left text-xs font-medium tracking-wider"
						>APPLIED ON</th
					>
				</tr>
			</thead>
			<tbody>
				{#each data.applications as app}
					<tr class="hover:bg-gray-50">
						<td class="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900"
							>{app.company}</td
						>
						<td class="py-4 px-6 whitespace-nowrap text-sm">{app.role}</td>
						<td class="py-4 px-6 whitespace-nowrap text-sm">{app.status}</td>
						<td class="py-4 px-6 whitespace-nowrap text-sm">{app.type}</td>
						<td class="py-4 px-6 whitespace-nowrap text-sm">{app.model}</td>
						<td class="py-4 px-6 whitespace-nowrap text-sm">{app.location}</td>
						<td class="py-4 px-6 whitespace-nowrap text-sm">{app.appliedAt.toDateString()}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7" class="text-center text-sm py-4 px-6 tracking-wider"
							>no applications found</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<footer class="fixed inset-x-0 bottom-0 pb-6 bg-red-300 w-full items-center flex flex-col">
		<div class="w-full border-t mb-2"></div>
		<p>
			a project by lyteral // <a href="https://github.com/lyt3ral/pursuit" class="underline"
				>source</a
			>
		</p>
	</footer>
</div>
