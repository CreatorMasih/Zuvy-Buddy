import StudentChatbot from "@/components/StudentChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="container mx-auto py-8">
        <StudentChatbot />
      </div>
    </div>
  );
};

export default Index;
