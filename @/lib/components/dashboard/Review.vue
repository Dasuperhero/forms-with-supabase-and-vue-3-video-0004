<script setup lang="ts">

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Button } from "../ui/button";
</script>


<template>
    <Dialog>
          <DialogTrigger as-child>
            <Button variant="outline"> Review </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Review</DialogTitle>
              <DialogDescription>
                Update student's progress here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit"> Save changes </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
</template>