<script setup lang="ts">
import { Button } from "..//ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle>Account</CardTitle>
      <CardDescription>
        Edit your personal details
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-4">
          <Avatar class="size-28">
            <AvatarImage
              src="https://github.com/radix-vue.png"
              alt="@radix-vue"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4 class="text-m font-bold tracking-tight">Profile Picture</h4>
            <p class="text-muted-foreground">PNG, JPEG under 15mb</p>
          </div>
        </div>

        <div>
          <Button variant="outline" class="mr-2"> Upload new picture </Button>
          <Button variant="secondary"> Delete </Button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-1 gap-2">
          <Label for="lname">Last Name</Label>
          <Input id="lname" type="text" placeholder="" />
        </div>
        <div class="col-span-1 gap-2">
          <Label for="fname">First Name</Label>
          <Input id="fname" type="text" placeholder="" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="gap-2">
          <Label for="email" class="col-span-2">Email</Label>
          <Input id="email" type="email" placeholder="instructor email" />
        </div>
        <div class="gap-2">
          <Label for="number" class="col-span-2">Phone Number</Label>
          <Input id="phonenumber" type="number" placeholder="instructor phone number" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <div class="gap-2">
          <Label for="dob" class="col-span-2">Date of Birth</Label>
          <Input id="dob" type="text" placeholder="instructor DOB" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
