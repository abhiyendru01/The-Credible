"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { User, Settings, Bell, Moon, Sun, LogOut, Edit2, Check, X, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export function ProfileScreen() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // User profile state
  const [profile, setProfile] = useState({
    name: "Rahul",
    username: "abhiyendru",
    bio: "News enthusiast and global citizen. Always looking for the latest updates on world events.",
    avatar: "/credible_icon.png?height=96&width=96",
  })

  // Editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Preferences state
  const [notifications, setNotifications] = useState(true)
  const [categories, setCategories] = useState([
    { name: "World", selected: true },
    { name: "Politics", selected: false },
    { name: "Business", selected: true },
    { name: "Technology", selected: true },
    { name: "Science", selected: false },
    { name: "Health", selected: true },
    { name: "Sports", selected: false },
    { name: "Entertainment", selected: true },
  ])

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem("newsPreferences")
    const savedProfile = localStorage.getItem("userProfile")

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setNotifications(parsed.notifications)
        if (parsed.categories) setCategories(parsed.categories)
      } catch (e) {
        console.error("Error parsing saved preferences:", e)
      }
    }

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setProfile(parsed)
        setEditedProfile(parsed)
      } catch (e) {
        console.error("Error parsing saved profile:", e)
      }
    }
  }, [])

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem(
      "newsPreferences",
      JSON.stringify({
        notifications,
        categories,
      }),
    )
  }, [notifications, categories])

  // Save profile when it changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
  }, [profile])

  const toggleCategory = (index: number) => {
    const newCategories = [...categories]
    newCategories[index].selected = !newCategories[index].selected
    setCategories(newCategories)

    toast({
      title: "Preferences updated",
      description: `${newCategories[index].name} category ${newCategories[index].selected ? "added" : "removed"}`,
    })
  }

  const toggleNotifications = (checked: boolean) => {
    setNotifications(checked)
    toast({
      title: "Notifications " + (checked ? "enabled" : "disabled"),
      description: checked ? "You will receive breaking news alerts" : "You won't receive breaking news alerts",
    })
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProfile(profile)
    setAvatarPreview(null)
  }

  const handleSaveProfile = () => {
    const updatedProfile = { ...editedProfile }
    if (avatarPreview) {
      updatedProfile.avatar = avatarPreview
    }
    setProfile(updatedProfile)
    setIsEditing(false)
    setAvatarPreview(null)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
      variant: "success",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    })
    // In a real app, this would handle authentication logout
  }

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gold-text">Profile</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5 text-primary" />
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="h-32 gold-gradient" />
        <div className="px-4 pb-4">
          <div className="flex justify-between items-end -mt-16">
            <div className="relative">
              <Avatar
                className="h-32 w-32 border-4 border-background cursor-pointer shadow-xl"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={avatarPreview || profile.avatar} className="object-cover" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div
                  className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer shadow-lg"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-5 w-5 text-black" />
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
                onClick={handleEditProfile}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                  onClick={handleSaveProfile}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
          <div className="mt-6">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">@{profile.username}</p>
                <p className="mt-2">{profile.bio}</p>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleInputChange}
                    className="mt-1 glass-card"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-muted-foreground mr-1">@</span>
                    <Input
                      id="username"
                      name="username"
                      value={editedProfile.username}
                      onChange={handleInputChange}
                      className="glass-card"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleInputChange}
                    className="mt-1 glass-card"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">Receive breaking news alerts</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={toggleNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">News Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Select your preferred news categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Badge
                key={category.name}
                variant={category.selected ? "default" : "outline"}
                className={`cursor-pointer ${
                  category.selected ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                }`}
                onClick={() => toggleCategory(index)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
