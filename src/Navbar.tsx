
import React from 'react';
import styled from 'styled-components';

import schoolLogo from './assets/FPI.jpg'; 
import departmentLogo from './assets/CTE.jpg'; 


const NavWrapper = styled.nav`
  background-color: #3ef3c6;
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between; 
  align-items: center;
`;

const NavContent = styled.div`
  display: flex; 
  align-items: center;
`;

const Logo = styled.img`
  height: 40px; 
  margin-right: 15px; 
  border-radius: 5px; 
`;

const DepartmentLogo = styled.img`
  height: 35px; /* Slightly smaller than main logo, adjust as needed */
  margin-right: 15px; /* Space between the two logos */
  border-radius: 5px; /* Optional */
`;

const NavTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavWrapper>
      <NavContent> {/* Wrap logos and title for better alignment */}
        <Logo src={schoolLogo} alt="School Logo" />
        <DepartmentLogo src={departmentLogo} alt="Department Logo" />
        <NavTitle><a href="/">COMPUTER ENGINEERING PAPER FORMATTER PROJECT</a></NavTitle>
      </NavContent>
      {/* You can add other navigation elements or links here if you want them on the right */}
      <div>
        {/* For example: <a href="/about" style={{ color: 'white', marginLeft: '20px' }}>About</a> */}
      </div>
    </NavWrapper>
  );
};

export default Navbar;