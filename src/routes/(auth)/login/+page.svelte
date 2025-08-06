<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form } = $props();
</script>

<div class="flex items-center justify-center min-h-screen bg-background p-4">
	<div
		class="w-full max-w-md p-8 space-y-6 bg-foreground border border-border rounded-lg shadow-lg"
	>
		<h1 class="text-3xl font-bold text-center text-heading">Sign In</h1>

		<form method="POST" action="?/login" use:enhance class="space-y-6">
			<div>
				<label for="username" class="block mb-2 font-medium text-body">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					class="w-full p-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 font-medium text-body">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full p-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			{#if form?.message}
				<p class="text-sm text-red-500 text-center">{form.message}</p>
			{/if}

			<button
				type="submit"
				class="w-full font-medium bg-primary hover:bg-primary-hover text-heading px-4 py-2 border border-border rounded transition hover:bg-opacity-80 cursor-pointer"
			>
				Sign In
			</button>
		</form>

		<p class="text-sm text-center text-body">
			Don't have an account?
			<a href="/register" class="font-medium hover:underline text-primary">Sign up</a>
		</p>
	</div>
</div>
