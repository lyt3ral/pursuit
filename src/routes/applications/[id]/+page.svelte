<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-8 bg-red-300 min-h-screen">
    <div class="flex justify-between items-center">
        <h1 class="text-3xl font-semibold font-serif">pursuit</h1>
        <a href="/applications" class="font-medium bg-yellow-200 px-4 py-2 border rounded transition hover:bg-yellow-300 cursor-pointer">
            Back to Applications
        </a>
    </div>

    <div class="mx-auto mt-12">
        {#if data.application}
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-6 border-b">
                    <h2 class="text-3xl font-bold font-serif text-gray-800">{data.application.role}</h2>
                    <p class="text-xl text-gray-600">at {data.application.company}</p>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="font-semibold text-gray-700">Status</p>
                            <p class="text-lg text-gray-900">{data.application.status}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="font-semibold text-gray-700">Job Type</p>
                            <p class="text-lg text-gray-900">{data.application.type}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="font-semibold text-gray-700">Work Model</p>
                            <p class="text-lg text-gray-900">{data.application.model}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="font-semibold text-gray-700">Location</p>
                            <p class="text-lg text-gray-900">{data.application.location}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
                            <p class="font-semibold text-gray-700">Applied On</p>
                            <p class="text-lg text-gray-900">{data.application.appliedAt.toDateString()}</p>
                        </div>
                        {#if data.application.notes}
                            <div class="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
                                <p class="font-semibold text-gray-700">Notes</p>
                                <p class="text-lg text-gray-900">{data.application.notes}</p>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        {:else}
            <div class="bg-white rounded-lg shadow-md p-8 text-center">
                <h1 class="text-2xl font-bold font-serif text-gray-800">Application not found</h1>
                <p class="text-gray-600 mt-2">The application you are looking for does not exist.</p>
            </div>
        {/if}
    </div>
</div>
