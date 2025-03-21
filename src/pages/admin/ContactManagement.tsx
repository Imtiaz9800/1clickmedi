
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Mail, Search, UserCheck, Trash2, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
  status: 'new' | 'read' | 'replied' | 'archived';
}

const ContactManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  
  // Message view state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ContactMessage | null>(null);
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate('/admin/login');
          toast({
            title: "Access Denied",
            description: "You need to login to access the admin dashboard",
            variant: "destructive",
          });
          return;
        }

        // Check if user is admin
        const { data: user } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.session.user.id)
          .single();

        if (!user || user.role !== 'admin') {
          navigate('/');
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          return;
        }

        setIsAdmin(true);
        
        // For demo purposes, let's generate some sample messages
        generateSampleMessages();
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const generateSampleMessages = () => {
    // This is just for demo - in a real app, you'd fetch from a database
    const sampleMessages: ContactMessage[] = [
      {
        id: "1",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        message: "I'm trying to book an appointment with Dr. Mehta but the system isn't working. Can you help?",
        created_at: "2023-10-15T10:30:00Z",
        is_read: true,
        status: 'replied'
      },
      {
        id: "2",
        name: "Priya Patel",
        email: "priya.patel@example.com",
        message: "Do you have any cardiologists available in Mumbai? I need to consult one urgently.",
        created_at: "2023-10-14T14:45:00Z", 
        is_read: true,
        status: 'read'
      },
      {
        id: "3",
        name: "Amit Singh",
        email: "amit.singh@example.com",
        message: "Is there a way to get home delivery for prescribed medicines? I'm unable to visit the pharmacy in person.",
        created_at: "2023-10-13T09:15:00Z",
        is_read: false,
        status: 'new'
      },
      {
        id: "4",
        name: "Neha Gupta",
        email: "neha.gupta@example.com",
        message: "I'd like to know if you have any pediatricians available for video consultation this weekend?",
        created_at: "2023-10-12T16:20:00Z",
        is_read: false,
        status: 'new'
      },
      {
        id: "5",
        name: "Vikram Desai",
        email: "vikram.desai@example.com",
        message: "Looking for information about healthcare packages for senior citizens. Do you have any special plans?",
        created_at: "2023-10-11T11:05:00Z",
        is_read: true,
        status: 'archived'
      }
    ];
    
    setMessages(sampleMessages);
    setFilteredMessages(sampleMessages);
  };

  useEffect(() => {
    filterMessages();
  }, [searchQuery, currentFilter, messages]);

  const filterMessages = () => {
    let filtered = messages;
    
    // Apply status filter
    if (currentFilter !== "all") {
      filtered = filtered.filter(message => message.status === currentFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        message =>
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query)
      );
    }
    
    setFilteredMessages(filtered);
  };

  const viewMessage = (message: ContactMessage) => {
    setCurrentMessage(message);
    setViewDialogOpen(true);
    
    // If message is unread, mark it as read
    if (message.status === 'new') {
      // In a real app, you'd update the database here
      const updatedMessages = messages.map(m => 
        m.id === message.id ? {...m, status: 'read' as const, is_read: true} : m
      );
      setMessages(updatedMessages);
    }
  };

  const markAsReplied = () => {
    if (!currentMessage) return;
    
    // In a real app, you'd update the database here
    const updatedMessages = messages.map(m => 
      m.id === currentMessage.id ? {...m, status: 'replied' as const} : m
    );
    setMessages(updatedMessages);
    
    toast({
      title: "Message marked as replied",
      description: "This message has been marked as replied.",
    });
    
    setViewDialogOpen(false);
  };

  const archiveMessage = () => {
    if (!currentMessage) return;
    
    // In a real app, you'd update the database here
    const updatedMessages = messages.map(m => 
      m.id === currentMessage.id ? {...m, status: 'archived' as const} : m
    );
    setMessages(updatedMessages);
    
    toast({
      title: "Message archived",
      description: "This message has been archived.",
    });
    
    setViewDialogOpen(false);
  };

  const confirmDelete = (id: string) => {
    setMessageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteMessage = () => {
    if (!messageToDelete) return;
    
    // In a real app, you'd delete from the database here
    const updatedMessages = messages.filter(m => m.id !== messageToDelete);
    setMessages(updatedMessages);
    
    toast({
      title: "Message deleted",
      description: "The message has been permanently deleted.",
    });
    
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">New</Badge>;
      case 'read':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Replied</Badge>;
      case 'archived':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Archived</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This will be redirected by the useEffect
  }

  return (
    <AdminLayout title="Contact Management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage and respond to messages from your users.
        </p>

        <Card className="bg-white dark:bg-gray-800 mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl">Contact Messages</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search messages..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="mb-6" onValueChange={setCurrentFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
                <TabsTrigger value="replied">Replied</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  No messages found. Check back later!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className={message.status === 'new' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}>
                        <TableCell>
                          <div className="font-medium">{message.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{message.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm line-clamp-1">
                            {message.status === 'new' && (
                              <AlertCircle className="h-4 w-4 text-blue-500 inline mr-1" />
                            )}
                            {message.message}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(message.created_at)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {getStatusBadge(message.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => viewMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            {message.status === 'new' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-green-500"
                                onClick={() => {
                                  const updatedMessages = messages.map(m => 
                                    m.id === message.id ? {...m, status: 'read' as const, is_read: true} : m
                                  );
                                  setMessages(updatedMessages);
                                  toast({ title: "Message marked as read" });
                                }}
                              >
                                <UserCheck className="h-4 w-4" />
                                <span className="sr-only">Mark as Read</span>
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-950"
                              onClick={() => confirmDelete(message.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Message Details</DialogTitle>
          </DialogHeader>
          {currentMessage && (
            <div className="py-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">{currentMessage.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentMessage.email}</p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                    {formatDate(currentMessage.created_at)}
                  </p>
                  {getStatusBadge(currentMessage.status)}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 mb-6">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {currentMessage.message}
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2">
                  {currentMessage.status !== 'replied' && (
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600"
                      onClick={markAsReplied}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                  
                  {currentMessage.status !== 'archived' && (
                    <Button 
                      variant="outline"
                      onClick={archiveMessage}
                    >
                      Archive
                    </Button>
                  )}
                  
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setViewDialogOpen(false);
                      confirmDelete(currentMessage.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMessage}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ContactManagement;
