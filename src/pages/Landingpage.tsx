import React, { useState, useEffect } from "react";
import {
  FileText,
  Zap,
  Shield,
  Download,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";
import styled from "styled-components"; 
import { useNavigate } from "react-router-dom";
import cte from "../assets/CTE.jpg"
import fpi from "../assets/FPI.jpg"



// Layout Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #581c87, #0f172a);
  color: white;
  overflow: hidden;
  position: relative;
`;

const AnimatedBackground = styled.div`
  position: fixed;
  inset: 0;
  opacity: 0.3;
  z-index: 0;
`;

const Blob = styled.div<{
  color: string;
  size: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  // Added props for mouse parallax
  mouseX?: number;
  mouseY?: number;
  movementScale?: number;
}>`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  filter: blur(48px);
  background: ${(props) => props.color};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  top: ${(props) => props.top};
  bottom: ${(props) => props.bottom};
  transition: transform 0.1s ease-out; /* Smooth transition for mouse movement */

  // Apply parallax transform if mouseX/mouseY are provided
  transform: translate(
    ${(props) => (props.mouseX || 0) * (props.movementScale || 0)}px,
    ${(props) => (props.mouseY || 0) * (props.movementScale || 0)}px
  );
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`;

const Section = styled.section`
  padding: 5rem 1.5rem;
`;

const CenteredSection = styled(Section)`
  text-align: center;
`;

// Navigation
const Nav = styled.nav`
  padding: 1.5rem;
  position: relative;
  z-index: 10;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.a`
  color: white;
  transition: color 0.2s;
  &:hover {
    color: #60a5fa;
  }
`;

const NavButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25);
    transform: scale(1.05);
  }
`;

// Hero Section
const HeroContainer = styled.div<{ isVisible: boolean }>`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: translateY(${(props) => (props.isVisible ? 0 : "10px")});
  transition: all 1s ease-out; /* Ensured ease-out for smoother entry */
`;

const TrustBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.25;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(to right, #60a5fa, #c084fc, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: block;
`;

const Subheading = styled.p`
  font-size: 1.25rem;
  color: #d1d5db;
  margin-bottom: 3rem;
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const PrimaryButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.25);
    transform: scale(1.05);
  }
`;

const SecondaryButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  font-size: 1.125rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Icon = styled.span`
  transition: transform 0.2s;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const StatLabel = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
`;

// Features Section
const FeatureGrid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const FeatureIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.2s;

  ${FeatureCard}:hover & {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #d1d5db;
  line-height: 1.625;
`;

// Demo Section
const DemoCard = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const DemoGrid = styled.div`
  display: grid;
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
  }
`;

const DemoStep = styled.div`
  display: flex;
  align-items: center;
`;

const StepIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const StepText = styled.span`
  font-size: 1.125rem;
`;

const DemoVisual = styled.div`
  position: relative;
`;

const DemoBox = styled.div`
  background: linear-gradient(
    to right,
    rgba(59, 130, 246, 0.2),
    rgba(168, 85, 247, 0.2)
  );
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FilePreview = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  border-radius: 9999px;
  background: linear-gradient(to right, #3b82f6, #9333ea);
`;

const Processing = styled.div`
  text-align: center;
  color: #d1d5db;
`;

const Spinner = styled(Clock)`
  animation: spin 1s linear infinite;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0.5rem;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Testimonials
const TestimonialGrid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Rating = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const TestimonialText = styled.p`
  color: #d1d5db;
  font-style: italic;
  margin-bottom: 1.5rem;
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
`;

const TestimonialRole = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
`;

// CTA Section
const CTACard = styled.div`
  background: linear-gradient(
    to right,
    rgba(59, 130, 246, 0.1),
    rgba(168, 85, 247, 0.1)
  );
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.button`
  padding: 1rem 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.25);
    transform: scale(1.05);
  }
`;

// Footer
const Footer = styled.footer`
  position: relative;
  z-index: 10;
  padding: 3rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterGrid = styled.div`
  display: grid;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FooterColumn = styled.div`
  &:first-child {
    grid-column: span 2;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FooterLogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterLogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

const FooterText = styled.p`
  color: #9ca3af;
`;

const FooterHeading = styled.h4`
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FooterLink = styled.div`
  color: #9ca3af;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #60a5fa;
  }
`;

const FooterDivider = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
  padding-top: 2rem;
  text-align: center;
  color: #9ca3af;
`;

export const Header = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("token")
  return (
    <Nav>
      <NavContainer>
        <Logo>
          <LogoIcon>
            <FileText className="w-6 h-6" />
          </LogoIcon>
          <LogoText onClick={() => navigate("/")}>FuTera</LogoText>
        </Logo>
        <NavLinks>
          <NavLink href="/admin/users">History</NavLink>
          <NavLink href="#about">About</NavLink>
         {
          user ? <>
          <NavButton onClick={() => {
            localStorage.removeItem("token")
            navigate("/login")
          }}>Logout</NavButton>
          </> : <>
           <NavButton onClick={() => navigate("/login")}>Sign In</NavButton>
           <NavButton onClick={() => navigate("/register")}>Sign Up</NavButton>
          </>
         }
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

const PaperFormatterLanding = () => {
  // mousePosition now used for dynamic blob movement
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // isVisible state for HeroContainer's fade-in
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Type the event 'e' as MouseEvent for better type safety
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate relative mouse position from the center of the viewport
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const relativeX = e.clientX - viewportCenterX;
      const relativeY = e.clientY - viewportCenterY;
      setMousePosition({ x: relativeX, y: relativeY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    setIsVisible(true); // Trigger hero section animation on mount

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Format your papers in seconds, not hours. Our AI-powered engine processes documents instantly.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Academic Standards",
      description:
        "Perfect APA, MLA, Chicago, and IEEE formatting. Always compliant with university requirements.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Smart Detection",
      description:
        "Automatically detects citation styles and formatting issues. No manual work required.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "PhD Student",
      content:
        "This tool saved me 20 hours on my dissertation formatting. Absolutely incredible!",
      rating: 5,
    },
    {
      name: "Dr. James Wilson",
      role: "Professor",
      content:
        "I recommend this to all my students. The accuracy is phenomenal.",
      rating: 5,
    },
    {
    name: "Maria Rodriguez",
      role: "Graduate Student",
      content:
        "Finally, a formatter that actually understands academic requirements.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "50K+", label: "Papers Formatted" },
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "15sec", label: "Avg. Process Time" },
    { number: "500+", label: "Universities" },
  ];
const StyledLogo = styled.img`
  width: 60px; /* Adjust logo size as needed */
  height: auto;
   object-fit: contain; 
  border-radius: 50%;
`;
const LogoAndTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem; 
  flex-wrap: wrap; 

`;
  return (
    <Container>
      {/* Animated background elements */}
      <AnimatedBackground>
        {/* Pass mouse position to blobs for parallax effect */}
        <Blob
          color="linear-gradient(to right, #3b82f6, #9333ea)"
          size="24rem"
          left="10%"
          top="20%"
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          movementScale={0.015} 
        />
        <Blob
          color="linear-gradient(to right, #ec4899, #f59e0b)"
          size="20rem"
          right="10%"
          bottom="20%"
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          movementScale={-0.025} // Negative scale makes it move in the opposite direction
        />
      </AnimatedBackground>

      {/* Navigation */}
      <div>
        <Header />
      </div>

      {/* Hero Section */}
      <CenteredSection>
        <HeroContainer isVisible={isVisible}>
          <TrustBadge>
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm">
              Trusted by 500+ universities worldwide
            </span>
          </TrustBadge>

          <Heading>
            Academic-Based Paper Formatting Platform 
           <LogoAndTextContainer>
              <StyledLogo
                src={fpi} // FPI logo URL
                alt="FPI Logo"
              />
              <GradientText>Format Like Magic</GradientText>
               <StyledLogo
                src={cte} // CTE logo URL
                alt="CTE Logo"
              />
            </LogoAndTextContainer>
          </Heading>

          <Subheading>
            Transform messy documents into perfectly formatted academic papers
            in seconds. APA, MLA, FPI, SPRINGER- we handle it all with AI precision.
          </Subheading>

          <ButtonGroup>
            <PrimaryButton onClick={() => navigate("/register")}>
              Start Formatting Free
              <Icon>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Icon>
            </PrimaryButton>
            <SecondaryButton>
              <Download className="w-5 h-5 mr-2" />
              See Example
            </SecondaryButton>
          </ButtonGroup>

          {/* Stats */}
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatItem key={index}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatItem>
            ))}
          </StatsContainer>
        </HeroContainer>
      </CenteredSection>

      {/* Features Section */}
      <Section id="features">
        <ContentContainer>
          <CenteredSection>
            <Heading>
              Why Choose
              <GradientText> PaperFormat</GradientText>
            </Heading>
            <Subheading>
              Built by academics, for academics. Every feature designed to save
              you time and ensure perfection.
            </Subheading>
          </CenteredSection>

          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </ContentContainer>
      </Section>

      {/* Demo Section */}
      <Section>
        <ContentContainer>
          <DemoCard>
            <DemoGrid>
              <div>
                <Heading>See It In Action</Heading>
                <Subheading>
                  Upload your document, select your style, and watch as our AI
                  transforms it into a perfectly formatted academic paper.
                </Subheading>
                <div className="space-y-4">
                  {[
                    "Upload Document",
                    "Choose Format Style",
                    "AI Processing",
                    "Download Perfect Paper",
                  ].map((step, index) => (
                    <DemoStep key={index}>
                      <StepIcon>
                        <CheckCircle className="w-4 h-4" />
                      </StepIcon>
                      <StepText>{step}</StepText>
                    </DemoStep>
                  ))}
                </div>
              </div>
              <DemoVisual>
                <DemoBox>
                  <FilePreview>
                    <FileInfo>
                      <FileText className="w-6 h-6 mr-3" />
                      <span className="font-semibold">research_paper.docx</span>
                    </FileInfo>
                    <ProgressBar />
                  </FilePreview>
                  <Processing>
                    <Spinner className="w-8 h-8 mb-2" />
                    <p>Processing with AI...</p>
                  </Processing>
                </DemoBox>
              </DemoVisual>
            </DemoGrid>
          </DemoCard>
        </ContentContainer>
      </Section>

      {/* Testimonials */}
      <Section>
        <ContentContainer>
          <CenteredSection>
            <Heading>
              Loved by
              <GradientText> Students & Professors</GradientText>
            </Heading>
          </CenteredSection>

          <TestimonialGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <Rating>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </Rating>
                <TestimonialText>"{testimonial.content}"</TestimonialText>
                <div>
                  <TestimonialAuthor>{testimonial.name}</TestimonialAuthor>
                  <TestimonialRole>{testimonial.role}</TestimonialRole>
                </div>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </ContentContainer>
      </Section>

      {/* CTA Section */}
      <Section>
        <ContentContainer>
          <CTACard>
            <Heading>Ready to Format Like a Pro?</Heading>
            <Subheading>
              Join thousands of students and researchers who trust PaperFormat
              for their academic success.
            </Subheading>
            <CTAButton>
              Get Started - It's Free
              <Icon>
                <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Icon>
            </CTAButton>
          </CTACard>
        </ContentContainer>
      </Section>

      {/* Footer */}
      <Footer>
        <ContentContainer>
          <FooterGrid>
            <FooterColumn>
              <FooterLogo>
                <FooterLogoIcon>
                  <FileText className="w-5 h-5" />
                </FooterLogoIcon>
                <FooterLogoText>PaperFormat</FooterLogoText>
              </FooterLogo>
              <FooterText>
                Making academic formatting effortless for everyone.
              </FooterText>
            </FooterColumn>
            <FooterColumn>
              <FooterHeading>Product</FooterHeading>
              <FooterLink>Features</FooterLink>
              <FooterLink>Pricing</FooterLink>
              <FooterLink>API</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterHeading>Support</FooterHeading>
              <FooterLink>Help Center</FooterLink>
              <FooterLink>Tutorials</FooterLink>
              <FooterLink>Contact</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterHeading>Company</FooterHeading>
              <FooterLink>About</FooterLink>
              <FooterLink>Blog</FooterLink>
              <FooterLink>Careers</FooterLink>
            </FooterColumn>
          </FooterGrid>
          <FooterDivider>
            <p>&copy; 2025 PaperFormat. All rights reserved.</p>
          </FooterDivider>
        </ContentContainer>
      </Footer>
    </Container>
  );
};

export default PaperFormatterLanding;