<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-8">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-2xl font-bold">Welcome, {data.user.username}!</h1>
		<form method="POST" action="?/logout" use:enhance>
			<button
				type="submit"
				class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
			>
				Sign out
			</button>
		</form>
	</div>

	<p>
		Visit <a href="https://svelte.dev/docs/kit" class="text-blue-600 hover:underline">
			svelte.dev/docs/kit
		</a> to read the documentation.
	</p>
</div>