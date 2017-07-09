<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Comment
 *
 * @ORM\Table(name="comment", indexes={@ORM\Index(name="fk_comment_User1_idx", columns={"id_user"}), @ORM\Index(name="fk_comment_Post1_idx", columns={"id_post"})})
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation("self", href = "expr('/comments/' ~ object.getId())")
 */
class Comment
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_comment", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Serializer\Expose()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text", length=65535, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $content;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $createdat;

    /**
     * @var \Acme\ApiBundle\Entity\User
     *
     * @ORM\ManyToOne(targetEntity="Acme\ApiBundle\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * })
     *
     *
     */
    private $User;

    /**
     * @var \AppBundle\Entity\Post
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Post")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_post", referencedColumnName="id_post")
     * })
     *
     *
     */
    private $Post;



    /**
     * Get idComment
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set content
     *
     * @param string $content
     * @return Comment
     */
    public function setContent($content)
    {
        $this->content = $content;
        $this->createdat = new \DateTime('now');

        return $this;
    }

    /**
     * Get content
     *
     * @return string 
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set createdat
     *
     * @param \DateTime $createdat
     * @return Comment
     */
    public function setCreatedat($createdat)
    {
        $this->createdat = new \DateTime('now');

        return $this;
    }

    /**
     * Get createdat
     *
     * @return \DateTime 
     */
    public function getCreatedat()
    {
        return $this->createdat;
    }

    /**
     * Set idUser
     *
     * @param \Acme\ApiBundle\Entity\User $idUser
     * @return Comment
     */
    public function setUser(\Acme\ApiBundle\Entity\User $User = null)
    {
        $this->User = $User;

        return $this;
    }

    /**
     * Get idUser
     *
     * @return \Acme\ApiBundle\Entity\User
     */
    public function getUser()
    {
        return $this->User;
    }

    /**
     * Set idPost
     *
     * @param \AppBundle\Entity\Post $idPost
     * @return Comment
     */
    public function setPost(\AppBundle\Entity\Post $Post = null)
    {
        $this->Post = $Post;

        return $this;
    }

    /**
     * Get idPost
     *
     * @return \AppBundle\Entity\Post 
     */
    public function getPost()
    {
        return $this->Post;
    }

    /**
     * Get idUser
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getIdUser()
    {
        return null !== $this->User ? $this->User->getId() : null;
    }

    /**
     * Get getUsername
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getUsername()
    {
        return null !== $this->User ? $this->User->getUsername() : null;
    }

    /**
     * Get getUserimage
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getUserimage()
    {
        return null !== $this->User ? $this->User->getPathavatarimg() : null;
    }

    /**
     * Get idPost
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getIdPost()
    {
        return null !== $this->User ? $this->Post->getId() : null;
    }
}
