<script setup lang="ts">
import { Switch } from "../ui/switch"
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from '../ui/separator'

</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle>Privacy & Security</CardTitle>
      <CardDescription>
        Keep your account secure
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-6">
      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-1 gap-2">
          <Label for="lname">Password</Label>
          <Input id="lname" type="text" placeholder="" />
        </div>
        <div class="col-span-1 gap-2">
          <Label for="fname">Confirm Password</Label>
          <Input id="fname" type="text" placeholder="" />
        </div>
      </div>
    </CardContent>
    <Separator />
    <CardHeader class="pb-6">
      <CardTitle>Students can view:</CardTitle>
    </CardHeader>
    <CardContent class="grid gap-6">
      <div class="flex items-center justify-between space-x-2">
        <Label for="necessary" class="flex flex-col space-y-1">
          <span>Your Photo</span>
          <span class="font-normal leading-snug text-muted-foreground">
            A profile picture helps personalise your account
          </span>
        </Label>
        <Switch id="photo" default-checked />
      </div>
      <div class="flex items-center justify-between space-x-2">
        <Label for="functional" class="flex flex-col space-y-1">
          <span>Your Phone Number</span>
          <span class="font-normal leading-snug text-muted-foreground">
            Allow students to contact you directly
          </span>
        </Label>
        <Switch id="phone_number" />
      </div>
    </CardContent>
  </Card>
</template>
